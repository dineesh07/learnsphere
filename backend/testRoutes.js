// Test if admin routes are working
const express = require('express');
const app = require('./app');

// List all registered routes
console.log('\n=== Registered Routes ===');
app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        console.log(r.route.path)
    } else if (r.name === 'router') {
        r.handle.stack.forEach(function (r2) {
            if (r2.route) {
                const method = Object.keys(r2.route.methods)[0].toUpperCase();
                console.log(`${method} ${r.regexp.source.replace('\\/?(?=\\/|$)', '')}${r2.route.path}`);
            }
        });
    }
});
console.log('========================\n');
