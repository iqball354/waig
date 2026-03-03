<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Posting extends Model
{
    protected $fillable = [
        'user_id',
        'connected_account_id',
        'media_url',
        'caption',
        'scheduled_at',
        'platform',
        'status',
        'error_message',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function connectedAccount()
    {
        return $this->belongsTo(ConnectedAccount::class);
    }
}
