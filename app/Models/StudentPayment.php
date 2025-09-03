<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'santri_id', 'amount', 'status', 'method', 'paid_at', 'note'
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function santri(): BelongsTo
    {
        return $this->belongsTo(Santri::class);
    }
}

