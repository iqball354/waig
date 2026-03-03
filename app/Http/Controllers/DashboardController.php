<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Posting;
use App\Models\ConnectedAccount;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // For local testing, we'll use mock data if DB is empty, 
        // but the code is ready for real DB interaction.
        $postings = Posting::with('connectedAccount')
            ->orderBy('scheduled_at', 'desc')
            ->take(5)
            ->get();

        if ($postings->isEmpty()) {
            $postings = collect([
                new Posting([
                    'id' => 1,
                    'media_url' => 'https://picsum.photos/seed/p1/100/100',
                    'caption' => 'Promo Diskon Akhir Tahun!',
                    'scheduled_at' => now()->addDays(2),
                    'platform' => 'Instagram',
                    'status' => 'Terjadwal'
                ]),
                new Posting([
                    'id' => 2,
                    'media_url' => 'https://picsum.photos/seed/p2/100/100',
                    'caption' => 'Tips Mengelola Konten...',
                    'scheduled_at' => now()->subDay(),
                    'platform' => 'Facebook',
                    'status' => 'Sukses'
                ])
            ]);
        }

        return view('dashboard', compact('postings'));
    }

    public function accounts()
    {
        $accounts = ConnectedAccount::all();
        
        if ($accounts->isEmpty()) {
            $accounts = collect([
                new ConnectedAccount([
                    'id' => '88294102931',
                    'name' => 'Travel Nusantara ID',
                    'type' => 'FB Page',
                    'status' => 'Aktif',
                    'token_expiry' => now()->addDays(45)
                ]),
                new ConnectedAccount([
                    'id' => '10293184920',
                    'name' => '@nusantara_travel',
                    'type' => 'IG Business',
                    'status' => 'Perlu Re-auth',
                    'token_expiry' => now()->subDays(2)
                ])
            ]);
        }

        return view('accounts', compact('accounts'));
    }

    public function profile()
    {
        $user = Auth::user() ?? new \App\Models\User([
            'name' => 'Andi Pratama',
            'email' => 'andi.pratama@company.com',
            'avatar' => 'https://picsum.photos/seed/andi/200/200',
            'role' => 'Administrator'
        ]);
        
        return view('profile', compact('user'));
    }
}
