<?php

namespace App\Jobs;

use App\Http\Livewire\Appoint;
use App\Models\Order;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class OrderAutoAppoint implements ShouldQueue
{
    public $tries = 1000;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(public Order $order)
    {
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        info("from job: env('max_await_time_in_seconds')", [
            env('max_await_time_in_seconds')
        ]);
        if ($this->order->status == "open" || $this->order->status == "await") {
            if ($this->order->status == "await") return $this->release(300);
            $Appoint = (new Appoint);
            $Appoint->order = $this->order;
            $users = User::where(['is_available' => 'true', "role" => "driver"])
                ->where(function ($query) {
                    $query->whereNull('appoint_to_order')
                        ->orWhere('appoint_to_order', $this->order->id);
                })->get();
            $users = $Appoint->addNearLocation($users);
            $found = false;
            info("from job: users", [
                $users
            ]);
            foreach ($users as $index => $user) {
                $appointRequest = $Appoint->appoint($user->id);
                sleep(env('max_await_time_in_seconds'));
                if ($appointRequest) {
                    $this->order = $this->order->refresh();
                    if (in_array($this->order->status, ["accepted", 'delivering', 'delivered', 'finished'])) {
                        $found = true;
                        break;
                    }
                    $appointRequest->delete();
                }
            }
            if (!$found) {
                return $this->release(60);
            }
        }
    }
}
