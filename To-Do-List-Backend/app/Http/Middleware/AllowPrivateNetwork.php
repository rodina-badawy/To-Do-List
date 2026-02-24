<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AllowPrivateNetwork
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->headers->has('Access-Control-Request-Private-Network')) {
            $response->headers->set('Access-Control-Allow-Private-Network', 'true');
        }

        return $response;
    }
}
