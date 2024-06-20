@extends('layouts.app')

@section('content')
    <div class="container d-flex flex-column flex-lg-row">
        <div class="card flex-row-fluid mb-2">

            <div class="card-body fs-6 text-gray-700">
                <h1 class="anchor fw-bold mb-5" id="active-rows" data-kt-scroll-offset="50">
                    Create Order
                </h1>

                <form method="POST" action="/orders">
                    @csrf
                    <div class="form-group row  mb-5">
                        <label for="text" class="col-4 col-form-label">Username</label>
                        <div class="col-8">
                            <input id="text" name="name" placeholder="Username" type="text" class="form-control" required="required">
                        </div>

                        @if ($errors->has('name'))
                            <div class="error text-danger">{{ $errors->first('name') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="text" class="col-4 col-form-label">Phone</label>
                        <div class="col-8">
                            <input id="text" name="phone" placeholder="Username" type="text" class="form-control" required="required">
                        </div>

                        @if ($errors->has('phone'))
                            <div class="error text-danger">{{ $errors->first('phone') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="text1" class="col-4 col-form-label">Start Location</label>
                        <div class="col-8">
                            <select name="start_location" placeholder="Start Location" class="start_location form-select" required="required"></select>
                        </div>

                        @if ($errors->has('start_location'))
                            <div class="error text-danger">{{ $errors->first('start_location') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="text2" class="col-4 col-form-label">End Location</label>
                        <div class="col-8">
                            <select name="end_location" placeholder="End Location" class="end_location form-select"></select>
                        </div>

                        @if ($errors->has('end_location'))
                            <div class="error text-danger">{{ $errors->first('end_location') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <div class="col-8">
                            <input id="text2" name="start_location_lat_long" placeholder="Start Location (lat,long)" type="hidden" class="form-control" required="required">
                        </div>

                        @if ($errors->has('start_location_lat_long'))
                            <div class="error text-danger">{{ $errors->first('start_location_lat_long') }}</div>
                        @endif
                    </div>

                    <div class="form-group row  mb-5">
                        <div class="col-8">
                            <input id="text2" name="end_location_lat_long" placeholder="End Location (lat,long)" type="hidden" class="form-control">
                        </div>

                        @if ($errors->has('end_location_lat_long'))
                            <div class="error text-danger">{{ $errors->first('end_location_lat_long') }}</div>
                        @endif
                    </div>

                    <div class="form-group row  mb-5">
                        <label for="select" class="col-4 col-form-label">Start At</label>
                        <div class="col-8">
                            <input id="text2" name="start_at" placeholder="Start At" type="datetime-local" class="form-control" required="required">
                        </div>

                        @if ($errors->has('start_at'))
                            <div class="error text-danger">{{ $errors->first('start_at') }}</div>
                        @endif
                    </div>

                    <div class="form-group row">
                        <label class="col-4">Payment Type</label>
                        <div class="col-8">
                            <div class="form-control form-radio form-control-inline mb-5">
                                <input name="payment_type" id="payment_type_0" type="radio" checked class="form-check-input form-control-input" value="cash" required="required">
                                <label for="payment_type_0" class="form-control-label form-ch">cash</label>
                            </div>
                            <div class="form-control form-radio form-control-inline mb-5">
                                <input name="payment_type" id="payment_type_1" type="radio" class=" form-check-input form-control-input" value="card" required="required">
                                <label for="payment_type_1" class="form-control-label">card</label>
                            </div>
                        </div>
                        @if ($errors->has('payment_type'))
                            <div class="error text-danger">{{ $errors->first('payment_type') }}</div>
                        @endif
                    </div>
                    <!-- Display Success Message -->
                    @if (session('success'))
                        <div class="success text-success">
                            {{ session('success') }}
                        </div>
                    @endif
                    <div class="form-group row">
                        <div class="offset-4 col-8">
                            <button name="submit" type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <link href="/assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
    <script src="/assets/plugins/global/plugins.bundle.js"></script>
    <script>
        $('.start_location').select2({
            placeholder: 'Start Location',
            ajax: {

                templateSelection: function(data, container) {
                    // Add custom attributes to the <option> tag for the selected option
                    console.log(data, container);
                },
                delay: 250, // wait 250 milliseconds before triggering the request
                url: 'https://api.geoapify.com/v1/geocode/autocomplete',
                dataType: 'json',
                data: function({
                    term,

                }) {
                    query = {
                        text: term,
                        apiKey: "97bb94b45c954b6e88ab76f1f3aa8ef1"
                    }
                    return query
                },
                processResults: function({
                    features
                }, params) {
                    params.page = params.page || 1;
                    let response = {
                        results: features.map((feature) => ({
                            "id": `${feature.geometry.coordinates[0]},${feature.geometry.coordinates[1]}`,
                            'text': feature.properties.formatted
                        })),
                        pagination: {
                            more: false
                        }
                    }
                    return response;
                    // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
                }
            }
        });
        $('.start_location').on('select2:selecting', function(e) {
            console.log('Selecting: ', e.params.args.data);
            setTimeout(() => {

                $('[name="start_location"] > option').val(e.params.args.data.text)
            }, 100);

            $('[name="start_location_lat_long"]').val(e.params.args.data.id)
        });
        $('.end_location').select2({
            placeholder: 'End Location',
            ajax: {

                templateSelection: function(data, container) {
                    // Add custom attributes to the <option> tag for the selected option
                    console.log(data, container);
                },
                delay: 250, // wait 250 milliseconds before triggering the request
                url: 'https://api.geoapify.com/v1/geocode/autocomplete',
                dataType: 'json',
                data: function({
                    term,

                }) {
                    query = {
                        text: term,
                        apiKey: "97bb94b45c954b6e88ab76f1f3aa8ef1"
                    }
                    return query
                },
                processResults: function({
                    features
                }, params) {
                    params.page = params.page || 1;
                    let response = {
                        results: features.map((feature) => ({
                            "id": `${feature.geometry.coordinates[0]},${feature.geometry.coordinates[1]}`,
                            'text': feature.properties.formatted
                        })),
                        pagination: {
                            more: false
                        }
                    }
                    return response;
                    // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
                }
            }
        });
        $('.end_location').on('select2:selecting', function(e) {
            console.log('Selecting: ', e.params.args.data);
            setTimeout(() => {
                $('[name="end_location"] > option').val(e.params.args.data.text)
            }, 100);

            $('[name="end_location_lat_long"]').val(e.params.args.data.id)

        });
    </script>
@endsection
