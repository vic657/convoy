<?php

// routes/web.php
Route::get('/{any}', function () {
    return view('index');
})->where('any', '^(?!api).*$');  // exclude API routes
