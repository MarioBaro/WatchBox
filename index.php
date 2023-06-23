<?php
    require_once './vendor/autoload.php'; // richiesta al vendor

    use Bramus\Router\Router; // utilizzo libreria Bramus Router
    use GuzzleHttp\Client; // utilizzo libreria Guzzle Client

    $router = new Router(); // apertura router
    $client = new Client(); // richiesta a Guzzle client

    $router->before('GET|POST|DELETE|PUT|OPTIONS|PATCH|HEAD', '/.*', function() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS, PATCH, HEAD');
        header('Access-Control-Allow-Headers: *');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    });

    $router->options('/.*', function() {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS, PATCH, HEAD');
        header('Access-Control-Allow-Headers: *');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    });

    require_once './movie.php';
    require_once './tv.php';
    require_once './unique_mt.php';

    $router->run();