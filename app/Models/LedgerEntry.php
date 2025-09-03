<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LedgerEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'account_id', 'santri_id', 'entry_date', 'description', 'debit', 'credit', 'reference'
    ];

    protected $casts = [
        'entry_date' => 'date',
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function santri(): BelongsTo
    {
        return $this->belongsTo(Santri::class);
    }
}

