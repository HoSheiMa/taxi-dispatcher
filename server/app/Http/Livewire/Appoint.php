<?php

namespace App\Http\Livewire;

use App\Models\Appoint as AppointModel;
use App\Models\User;
use Livewire\Component;

class Appoint extends Component
{
    public $order;
    public $status;
    public $appoint_at;
    public $appoint_to_user_id;
    public function appoint($user)
    {
        $user = User::find($user);
        if ($user->role == "driver" && $user->is_available == "true") {
            $now = now();
            // update status to await
            AppointModel::where([
                'order_id' =>  $this->order->id,
                'user_id' => $user->id,
                'status' => "refuse",
            ])->delete();
            $appoint = AppointModel::create([
                'order_id' =>  $this->order->id,
                'user_id' => $user->id,
                'status' => "await",
                "appoint_at" => $now
            ]);
            $this->status = "await";
            $this->appoint_at = $now;
            $this->appoint_to_user_id = $user->id;
            return $appoint;
        }
    }
    protected function codexworldGetDistanceOpt($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo)
    {
        $rad = M_PI / 180;
        //Calculate distance from latitude and longitude
        $theta = $longitudeFrom - $longitudeTo;
        $dist = sin($latitudeFrom * $rad)
            * sin($latitudeTo * $rad) +  cos($latitudeFrom * $rad)
            * cos($latitudeTo * $rad) * cos($theta * $rad);

        return acos($dist) / $rad * 60 *  1.853;
    }
    public function addNearLocation($users)
    {
        // add near to start location in KM
        foreach ($users as $index => $user) {
            $order_lat_long = explode(',', $this->order->start_location_lat_long);
            $order_lat = $order_lat_long[0];
            $order_long = $order_lat_long[1];
            $user_lat = $user->current_lat;
            $user_long = $user->current_long;
            $user->near = (int)$this->codexworldGetDistanceOpt(
                $user_lat,
                $user_long,
                $order_lat,
                $order_long
            );
        }
        // sort users by near location KM
        $users = collect($users)->sortBy('near');
        return  $users;
    }
    public function render()
    {
        $users = User::where(['is_available' => 'true', "role" => "driver"])
            ->where(function ($query) {
                $query->whereNull('appoint_to_order')
                    ->orWhere('appoint_to_order', $this->order->id);
            })->get();
        $users = $this->addNearLocation($users);
        $appoints = AppointModel::where('order_id', $this->order->id)->whereIn('status', ['await', 'accepted'])->get();
        if (sizeof($appoints) == 0) {
            $this->status = "open";
            $this->appoint_to_user_id = null;
            $this->appoint_at = null;
        } else {
            $appoints->each(function (AppointModel $appoint) {
                if ($appoint->status == "open") return $appoint->delete();
                if ($appoint->status == "accepted") {
                    $this->status = "accepted";
                    $this->appoint_at = $appoint->created_at;
                    $this->appoint_to_user_id = $appoint->user_id;
                    return;
                }


                if ($appoint->created_at->diffInSeconds() > env('max_await_time_in_seconds')) {
                    $this->status = "open";
                    $this->appoint_to_user_id = null;
                    $this->appoint_at = null;
                    $appoint->update(['status' => 'refuse']);
                } else {
                    $this->status = "await";
                    $this->appoint_to_user_id = $appoint->user_id;
                    $this->appoint_at = $appoint->created_at;
                }
            });
        }
        return view('livewire.appoint')->with('users', $users);
    }
}
