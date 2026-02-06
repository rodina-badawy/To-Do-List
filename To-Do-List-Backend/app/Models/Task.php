<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'category',
        'priority',
        'due',
        'status',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'due' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
