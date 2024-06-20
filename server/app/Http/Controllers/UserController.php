<?php

namespace App\Http\Controllers;

use App\Jobs\OrderAutoAppoint;
use App\Models\Appoint;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('users.index')->with('users', User::paginate(15));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('users.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $form = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string',  Rule::in(['admin', 'driver'])],
            'is_banned' => ['required', 'string',  Rule::in(['true', 'false'])],
        ]);
        $form['password'] = bcrypt($form['password']);
        $user = User::create($form);
        return back()->with('success', 'Created Successfully')->with('user', $user);
    }

    /**
     * Update the user available status.
     * ! API ONLY
     */
    public function setAvailable(Request $request, $status)
    {
        $user = auth('api')->user()->getAuthIdentifier();
        $user = User::find($user);
        $updated_data = [
            'is_available' => $status
        ];

        if (isset($request->lat) && isset($request->long)) {
            $updated_data['current_lat'] = $request->lat;
            $updated_data['current_long'] = $request->long;
        }
        info('testing location', $updated_data);
        $user->update($updated_data);

        return $user->refresh();
    }

    public function updateStatus(Request $request, Order $order, $status)
    {
        if (auth('api')->user()->getAuthIdentifier() == $order->appoint_to_user) {
            switch ($status) {
                case 'cancelled':
                    $status = "open";
                    $order->update([
                        'appoint_to_user' => null,
                    ]);
                    Appoint::where('order_id', $order->id)->delete();
                    OrderAutoAppoint::dispatch($order);
                    User::find(auth('api')->user()->getAuthIdentifier())->update([
                        'appoint_to_order' => null,
                        'is_available' => true
                    ]);
                    break;
                case 'delivered':
                    User::find(auth('api')->user()->getAuthIdentifier())->update([
                        'appoint_to_order' => null,
                        'is_available' => true
                    ]);
                    break;
                default:
                    # code...
                    break;
            }
            $order->update([
                'status' => $status
            ]);
            return ["message" => "Updated!"];
        }
        return ['error' => true];
    }

    public function appoint(Appoint $appoint)
    {
        if ($appoint->created_at->diffInRealSeconds(now(), false) <= env('max_await_time_in_seconds') && $appoint->status == "await") {
            auth('api')->user()->appoint($appoint);
            return [
                'message' => "You are winner of order."
            ];
        }
        $appoint->update(['status' => "refuse"]);
        return [
            "error" => "Too Late."
        ];
    }
    /**
     * Get user(driver) current appointment .
     * ! API ONLY
     */
    public function appointment()
    {
        $user = auth('api')->user();

        // ? delivering order   
        $is_order_delivering = $user->appoint_to_order && Order::where(['id' => $user->appoint_to_order])->whereIn('status', ['accepted', 'delivering'])->exists();
        if ($is_order_delivering) {
            // ? return current order
            return [
                "appoint" => null,
                'order' =>  Order::find($user->appoint_to_order),
                'user' => auth('api')->user(),
                'status' => "delivering"
            ];
        }
        // ? get all await appoints for our user
        $appoints = Appoint::where([
            ['user_id', '=', $user->id],
        ])->whereIn('status', ['accept', 'await'])->get();

        // ? filter out dated appoints (10 seconds)
        $appoints->filter(function ($appoint) {
            if ($appoint->created_at->diffInRealSeconds(now(), false) <=  env('max_await_time_in_seconds') && $appoint->status == "await") return true;
            $appoint->update(['status' => "refuse"]);
            return false;
        });

        // ? return first one only
        if ($appoints->first()) {
            $appoint = $appoints->first();
            return [
                'appoint' => $appoint,
                'order' =>  Order::find($appoint->order_id),
                'user' => auth('api')->user(),
                'status' => "await"
            ];
            return $appoints->first();
        }

        return ["error" => "No Appoint Available"];
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        return view('users.edit')->with('user', $user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string',  Rule::in(['admin', 'driver'])],
            'is_banned' => ['required', 'string',  Rule::in(['true', 'false'])],
        ]);

        $user->name = $request->name;
        if ($request->password) {
            $user->password = bcrypt($request->password);
        }
        $user->role = $request->role;
        $user->is_banned = $request->is_banned;
        $user->save();

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        if ($user->is_admin()) return back();
        $user->delete();
        return back()->with('success', 'Deleted Successfully.');
    }
}
