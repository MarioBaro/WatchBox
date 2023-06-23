<?php
$router->get('/3/discover/movie', function() { // endpoint API.DB.film
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $page = (isset($_GET['page'])) ? $_GET['page'] : 1; // richiesta GET impaginazione
    $language = (isset($_GET['language'])) ? $_GET['language'] : 'en'; // richiesta GET lingua traduzione
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB
    
    $results = $sql->query("SELECT f.id, f.backdrop_path, f.release_date, f.vote_average, f.vote_count, GROUP_CONCAT(id_genre), 
    t_title.type, t_title.translate AS t_title, t_overview.translate AS t_overview FROM film f 
    INNER JOIN film_genrefilm fg ON fg.id_film = f.id 
    LEFT JOIN translate t_title ON (t_title.id_type = f.id AND t_title.field = 'title') 
    LEFT JOIN translate t_overview ON (t_overview.id_type = f.id AND t_overview.field = 'overview') 
    INNER JOIN language AS l ON (t_title.id_language = l.id_language AND t_overview.id_language = l.id_language) 
    WHERE l.iso_639_1 = '$language' AND (t_title.type = 'F' AND t_overview.type = 'F') 
    GROUP BY fg.id_film LIMIT 20 OFFSET " . (($page - 1) * 20)); // SELECT & JOIN & GROUP BY film-genrefilm
    $data = $results->fetch_all(MYSQLI_ASSOC);


    echo json_encode(["results"=>$data]);
});

$router->get('/3/genre/movie/list', function() { // endpoint API.DB.genre_film
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    $results = $sql->query("SELECT * FROM genrefilm");

    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});

$router->get('/3/search/movie', function() { // endpoint API.DB.search_film
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $page = (isset($_GET['page'])) ? $_GET['page'] : 1; // richiesta GET impaginazione
    $query = (isset($_GET['query'])) ? $_GET['query'] : NULL; // richiesta GET query
    $sort_by = (isset($_GET['sort_by'])) ? $_GET['sort_by'] : 'vote_average DESC'; // richiesta GET sort_by
    $language = (isset($_GET['language'])) ? $_GET['language'] : 'en'; // richiesta GET lingua traduzione
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    $results = $sql->query("SELECT f.id, f.backdrop_path, f.release_date, f.vote_average, f.vote_count, t_title.type, t_title.translate as t_title, t_overview.translate as t_overview 
    FROM film AS f 
    LEFT JOIN translate t_title ON (t_title.id_type = f.id AND t_title.field = 'title') 
    LEFT JOIN translate t_overview ON (t_overview.id_type = f.id AND t_overview.field = 'overview') 
    INNER JOIN language AS l ON (t_title.id_language = l.id_language AND t_overview.id_language = l.id_language) 
    WHERE (title LIKE '%$query%' OR vote_average LIKE '%$query%' 
    OR release_date LIKE '%$query%' OR overview LIKE '%$query%') 
    AND l.iso_639_1 = '$language' AND (t_title.type = 'F' AND t_overview.type = 'F') 
    ORDER BY $sort_by LIMIT 20 OFFSET " . (($page - 1) * 20)); // SELECT & ORDER BY query di ricerca film

    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});

$router->post('/3/movie/{id}/rating', function($id){ // endpoint API.DB.vote_film
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB
    $vote = (isset($_POST['value'])) ? $_POST['value'] : NULL; // richiesta POST vote

    $sql->query("UPDATE film AS f SET f.vote_count = f.vote_count + 1, f.vote_average = ROUND((((f.vote_average * f.vote_count) + $vote) / (f.vote_count + 1)), 1) WHERE f.id = '$id'"); // UPDATE vote_average & vote_count .film
    $results = $sql->query("SELECT f.vote_average, f.vote_count FROM film AS f WHERE f.id = '$id'"); // SELECT vote_film
    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});

$router->post('/3/movie/{id}/rating_delete', function($id) { // endpoint API.DB.vote_film
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB
    $vote = (isset($_POST['value'])) ? $_POST['value'] : NULL; // richiesta POST vote

    $sql->query("UPDATE film AS f SET f.vote_count = f.vote_count - 1, f.vote_average = ROUND((((f.vote_average * f.vote_count) - $vote) / (f.vote_count - 1)), 1) WHERE f.id = '$id'"); // UPDATE vote_average & vote_count .film
    $results = $sql->query("SELECT f.vote_average, f.vote_count FROM film AS f WHERE f.id = '$id'"); // SELECT vote_film
    $data = $results->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(["results"=>$data]);
});