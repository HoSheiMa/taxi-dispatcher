@extends('layouts.app')

@section('content')
    <div class="container d-flex flex-column flex-lg-row">
        <div class="card flex-row-fluid mb-2">

            <div class="card-body fs-6 text-gray-700">
                <h1 class="anchor fw-bold mb-5" id="active-rows" data-kt-scroll-offset="50">
                    Order #{{ $order->id }} Appoint
                </h1>
                @livewire('appoint', [
                    'order' => $order,
                ])
            </div>
        </div>
    </div>
@endsection
