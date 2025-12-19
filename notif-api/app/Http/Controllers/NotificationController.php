<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return Notification::where('user_id', 1)
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $notification = Notification::create([
            'user_id' => 1,
            'title'   => $request->title,
            'message' => $request->message,
        ]);

        // Emit to socket server
        Http::post('http://localhost:3001/emit', [
            'room'  => 'user:1',
            'event' => 'notification:new',
            'data'  => $notification,
        ]);

        return $notification;
    }
}