<?php

namespace App\Http\Controllers;

use App\Jobs\OrderAutoAppoint;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('orders.index')->with('orders', Order::paginate(15));
    }

    public function new()
    {
        return view('orders.index')->with('orders', Order::where('status', 'open')->orderBy('created_at')->paginate(15));
    }

    public function appoint(Order $order)
    {
        return view('orders.appoint')->with('order', $order);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('orders.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $form = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'payment_type' => ['required', 'string',  Rule::in(['cash', 'card'])],
            'start_location' => ['required', 'string'],
            'end_location' => ['nullable', 'string'],
            'start_location_lat_long' => ['required', 'string'],
            'end_location_lat_long' => ['nullable', 'string'],
            'start_at' => ['required', 'date', 'string'],
        ]);
        $order = Order::create($form);
        OrderAutoAppoint::dispatch($order);
        return back()->with('success', 'Created Successfully')->with('order', $order);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return back()->with('success', 'Deleted Successfully.'); //
    }
}
