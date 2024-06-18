@extends('layouts.app')

@section('content')
    <div class="container d-flex flex-column flex-lg-row">
        <div class="card flex-row-fluid mb-2">

            <div class="card-body fs-6 text-gray-700">
                <h1 class="anchor fw-bold mb-5" id="active-rows" data-kt-scroll-offset="50">
                    Orders List
                </h1>

                <!-- Display Success Message -->
                @if (session('success'))
                    <div class="success text-success mb-5">
                        {{ session('success') }}
                    </div>
                @endif
                <div class="table-responsive">
                    <table class="table table-rounded table-row-bordered border gy-7 gs-7">
                        <thead>
                            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                                <th>ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Payment Type</th>
                                <th>Start Location</th>
                                <th>End Location</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($orders as $order)
                                <tr>
                                    <td>{{ $order->id }}</td>
                                    <td>{{ $order->name }}</td>
                                    <td>
                                        @switch($order->status)
                                            @case('open')
                                                <span class="text-primary  text-uppercase">{{ $order->status }}</span>
                                            @break

                                            @case('accepted')
                                                <span class="text-success  text-uppercase">{{ $order->status }}</span>
                                            @break

                                            @case('cancelled')
                                                <span class="text-danger  text-uppercase">{{ $order->status }}</span>
                                            @break

                                            @case('delivering')
                                                <span class="text-warning  text-uppercase">{{ $order->status }}</span>
                                            @break

                                            @case('delivered')
                                                <span class="text-success  text-uppercase">{{ $order->status }}</span>
                                            @break

                                            @default
                                                <span class="text-uppercase">{{ $order->status }}</span>
                                        @endswitch
                                    </td>
                                    <td>{{ $order->payment_type }}</td>
                                    <td>{{ $order->start_location }}</td>
                                    <td>{{ $order->end_location }}</td>
                                    <td class="text-end">
                                        <a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-kt-menu-trigger="click"
                                            data-kt-menu-placement="bottom-end">Actions
                                            <i class="ki-outline ki-down fs-5 ms-1"></i></a>
                                        <!--begin::Menu-->
                                        <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                                            data-kt-menu="true" style="">
                                            <!--begin::Menu item-->

                                            @if ($order->status == 'open')
                                                <div class="menu-item px-3">
                                                    <a href="/orders/{{ $order->id }}/appoint" class="menu-link px-3">Appoint Driver</a>
                                                </div>
                                            @endif
                                            <div class="menu-item px-3">
                                                <a href="/orders/{{ $order->id }}/edit" class="menu-link px-3">Edit</a>
                                            </div>
                                            <!--end::Menu item-->
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <form action="/orders/{{ $order->id }}" method="POST" onsubmit="return confirm('Do you really want to delete the user?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <a onclick="$(this).parent().submit()" class="menu-link px-3" data-kt-customer-table-filter="delete_row">Delete</a>
                                                </form>
                                            </div>
                                            <!--end::Menu item-->
                                        </div>
                                        <!--end::Menu-->
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    {{ $orders->links() }}
                </div>
            </div>
        </div>
    </div>
@endsection
