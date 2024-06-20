<div class="table-responsive">
    <table class="table table-rounded table-row-bordered border gy-7 gs-7">
        <thead>
            <tr class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Near to Start Location</th>
                <th>Role</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach ($users as $user)
                <tr key={{ $user->id }}>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->near }} KM</td>
                    <td>{{ $user->role }}</td>
                    <td class="text-end">
                        <div wire:poll.1s>
                            @if (!$appoint_to_user_id)
                                @if ($status == 'open')
                                    <button wire:click='appoint({{ $user->id }})' class="btn btn-success">Appoint</button>
                                @endif
                            @else
                                @if ($status == 'accepted')
                                    @if ($appoint_to_user_id == $user->id)
                                        <button class="btn text-success">
                                            Accepted From Driver
                                        </button>
                                    @endif
                                @else
                                    @if ($appoint_to_user_id == $user->id)
                                        <button wire:click='appoint({{ $user->id }})' class="btn btn-success" disabled data-kt-indicator="on">
                                            <span class="indicator-progress">
                                                Wait accept from driver ( remain {{ env('max_await_time_in_seconds') - $appoint_at->diffInSeconds() }} seconds) <span
                                                    class="spinner-border spinner-border-sm align-middle ms-2"></span>
                                            </span></button>
                                    @else
                                        <button wire:click='appoint({{ $user->id }})' class="btn btn-success" disabled>Appoint</button>
                                    @endif
                                @endif
                            @endif
                        </div>

                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
