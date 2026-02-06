<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->tasks();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('today') && $request->today) {
            $query->whereDate('due', today());
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:work,home,personal',
            'priority' => 'required|in:high,medium,low',
            'due' => 'required|date',
        ]);

        $task = $request->user()->tasks()->create($request->only([
            'title', 'category', 'priority', 'due',
        ]));

        return response()->json($task, 201);
    }

    public function show(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:work,home,personal',
            'priority' => 'sometimes|in:high,medium,low',
            'due' => 'sometimes|date',
        ]);

        $task->update($request->only([
            'title', 'category', 'priority', 'due',
        ]));

        return response()->json($task);
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }

    public function complete(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'note' => 'nullable|string',
        ]);

        $task->update([
            'status' => 'completed',
            'note' => $request->note,
        ]);

        return response()->json($task);
    }

    public function missed(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'note' => 'nullable|string',
        ]);

        $task->update([
            'status' => 'missed',
            'note' => $request->note,
        ]);

        return response()->json($task);
    }
}
