<?php

namespace Reporthero\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $roles = $this->getRequiredRoleForRoute($request->route());
        
        if ($request->user()->checkAdminRole($roles) && $roles) {
            return $next($request);
        }

        return response([
            'error' => [
                'code' => 'UNAUTHORIZE ACCESS!',
                'description' => 'You are not authorized to access this resource.',
            ],
        ], 401);
    }

    private function getRequiredRoleForRoute($route)
    {
        $actions = $route->getAction();

        return isset($actions['roles']) ? $actions['roles'] : null;
    }
}
