<?php
$router->get('/3/configuration/languages', function() { // endpoint API.DB.languages
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $language = (isset($_GET['language'])) ? $_GET['language'] : 'en'; // richiesta GET lingua traduzione
    $page = (isset($_GET['page'])) ? $_GET['page'] : 1; // richiesta GET impaginazione
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    $results = $sql->query("SELECT * FROM language"); // SELECT & JOIN translate con impaginazione .film
    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});