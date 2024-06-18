@extends('layouts.app')

@section('content')
    <div class="container d-flex flex-column flex-lg-row">
        <div class="card flex-row-fluid mb-2">

            <div class="card-body fs-6 text-gray-700">
                <h1 class="anchor fw-bold mb-5" id="active-rows" data-kt-scroll-offset="50">
                    Update User
                </h1>

                <form method="POST" action="{{ route('users.update', $user->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="form-group row mb-5">
                        <label for="text3" class="col-4 col-form-label">Email (disabled)</label>
                        <div class="col-8">
                            <input value="{{ old('email', $user->email) }}" required id="text3" name="email" placeholder="Email" type="text" class="form-control" disabled>
                        </div>
                        @if ($errors->has('email'))
                            <div class="error text-danger">{{ $errors->first('email') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="text" class="col-4 col-form-label">Username</label>
                        <div class="col-8">
                            <input value="{{ old('name', $user->email) }}" id="text" name="name" placeholder="Username" type="text" class="form-control" required="required">
                        </div>

                        @if ($errors->has('name'))
                            <div class="error text-danger">{{ $errors->first('name') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="text1" class="col-4 col-form-label">Password</label>
                        <div class="col-8">
                            <input id="text1" name="password" placeholder="Password" type="password" class="form-control">
                        </div>

                        @if ($errors->has('Password'))
                            <div class="error text-danger">{{ $errors->first('Password') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="text2" class="col-4 col-form-label">Password Confirmation</label>
                        <div class="col-8">
                            <input id="text2" name="password_confirmation" placeholder="Password Confirmation" type="password" class="form-control">
                        </div>

                        @if ($errors->has('password_confirmation'))
                            <div class="error text-danger">{{ $errors->first('password_confirmation') }}</div>
                        @endif
                    </div>
                    <div class="form-group row  mb-5">
                        <label for="select" class="col-4 col-form-label">Role</label>
                        <div class="col-8">
                            <select id="select" name="role" class="form-select" required="required">
                                <option value="admin" {{ old('role', $user->role) == 'admin' ? 'selected' : '' }}>Admin</option>
                                <option value="driver" {{ old('role', $user->role) == 'driver' ? 'selected' : '' }}>Driver</option>
                            </select>
                        </div>

                        @if ($errors->has('role'))
                            <div class="error text-danger">{{ $errors->first('role') }}</div>
                        @endif
                    </div>

                    <div class="form-group row">
                        <label class="col-4">Ban</label>
                        <div class="col-8">
                            <div class="form-control form-radio form-control-inline mb-5">
                                <input name="is_banned" {{ old('role', $user->is_banned) == 'true' ? 'checked' : '' }} id="is_banned_0" type="radio" class="form-control-input"
                                    value="true" required="required">
                                <label for="is_banned_0" class="form-control-label">True</label>
                            </div>
                            <div class="form-control form-radio form-control-inline mb-5">
                                <input name="is_banned" {{ old('role', $user->is_banned) == 'false' ? 'checked' : '' }} id="is_banned_1" checked type="radio"
                                    class="form-control-input" value="false" required="required">
                                <label for="is_banned_1" class="form-control-label">False</label>
                            </div>
                        </div>
                        @if ($errors->has('is_banned'))
                            <div class="error text-danger">{{ $errors->first('is_banned') }}</div>
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
                            <button name="submit" type="submit" class="btn btn-primary">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
