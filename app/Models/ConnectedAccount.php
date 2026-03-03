<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConnectedAccount extends Model
{
    protected $fillable = [
        'user_id',
        'account_id',
        'name',
        'type',
        'access_token',
        'token_expiry',
        'status',
    ];

    protected $casts = [
        'token_expiry' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function postings()
    {
        return $this->hasMany(Posting::class);
    }
}
