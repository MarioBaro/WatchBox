<?php
$router->get('/3/discover/tv', function() { // endpoint API.DB.serietv
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $page = (isset($_GET['page'])) ? $_GET['page'] : 1; // richiesta GET impaginazione
    $language = (isset($_GET['language'])) ? $_GET['language'] : 'en'; // richiesta GET lingua traduzione
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    $results = $sql->query("SELECT s.id, s.backdrop_path, s.first_air_date, s.vote_average, s.vote_count, GROUP_CONCAT(id_genre), 
    t_name.type, t_name.translate AS t_name, t__overview.translate AS t__overview   FROM serietv s 
    INNER JOIN serietv_genreserietv sg ON sg.id_serietv = s.id 
    LEFT JOIN translate t_name ON (t_name.id_type = s.id AND t_name.field = 'name') 
    LEFT JOIN translate t__overview ON (t__overview.id_type = s.id AND t__overview.field = 'overview') 
    INNER JOIN language AS l ON (t_name.id_language = l.id_language AND t__overview.id_language = l.id_language) 
    WHERE l.iso_639_1 = '$language' AND (t_name.type = 'S' AND t__overview.type = 'S') 
    GROUP BY sg.id_serietv LIMIT 20 OFFSET " . (($page - 1) * 20)); // SELECT & JOIN & GROUP BY serietv-genreserietv
    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});

$router->get('/3/genre/tv/list', function() { // endpoint API.DB.genre_serietv
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    $results = $sql->query("SELECT * FROM genreserietv");

    $data = $results->fetch_all(MYSQLI_ASSOC);

    var_dump($data);

    echo json_encode(["results"=>$data]);
});

$router->get('/3/search/tv', function() { // endpoint API.DB.search_serietv
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $page = (isset($_GET['page'])) ? $_GET['page'] : 1; // richiesta GET impaginazione
    $query = (isset($_GET['query'])) ? $_GET['query'] : NULL; // richiesta GET query
    $sort_by = (isset($_GET['sort_by'])) ? $_GET['sort_by'] : 'vote_average DESC'; // richiesta GET sort_by
    $language = (isset($_GET['language'])) ? $_GET['language'] : 'en'; // richiesta GET lingua traduzione
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB

    $results = $sql->query("SELECT s.id, s.backdrop_path, s.first_air_date, s.vote_average, t_name.type, t_name.translate as t_name, t__overview.translate as t__overview 
    FROM serietv AS s 
    LEFT JOIN translate t_name ON (t_name.id_type = s.id AND t_name.field = 'name') 
    LEFT JOIN translate t__overview ON (t__overview.id_type = s.id AND t__overview.field = 'overview') 
    INNER JOIN language AS l ON (t_name.id_language = l.id_language AND t__overview.id_language = l.id_language) 
    WHERE ('name' LIKE '%$query%' OR vote_average LIKE '%$query%' 
    OR first_air_date LIKE '%$query%' OR overview LIKE '%$query%') 
    AND l.iso_639_1 = '$language' AND (t_name.type = 'S' AND t__overview.type = 'S') 
    ORDER BY $sort_by LIMIT 20 OFFSET " . (($page - 1) * 20)); // SELECT & ORDER BY query di ricerca serietv
    
    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});

$router->post('/3/tv/{id}/rating', function($id) { // endpoint API.DB.vote_serietv
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB
    $vote = (isset($_POST['value'])) ? $_POST['value'] : NULL; // richiesta POST vote

    $sql->query("UPDATE serietv AS s SET s.vote_count = s.vote_count + 1, s.vote_average = ROUND((((s.vote_average * s.vote_count) + $vote) / (s.vote_count + 1)), 1) WHERE s.id = '$id'"); // UPDATE vote_average & vote_count .serietv
    $results = $sql->query("SELECT s.vote_average, s.vote_count FROM serietv AS s WHERE s.id = '$id'"); // SELECT vote_serietv
    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});

$router->post('/3/tv/{id}/rating_delete', function($id) { // endpoint API.DB.vote_serietv
    $host = "127.0.0.1";
    $user = "root";
    $password = "";
    $dbname = "catalogo";
    $sql = new mysqli($host, $user, $password, $dbname); // connessione DB
    $vote = (isset($_POST['value'])) ? $_POST['value'] : NULL; // richiesta POST vote

    $sql->query("UPDATE serietv AS s SET s.vote_count = s.vote_count - 1, s.vote_average = ROUND((((s.vote_average * s.vote_count) - $vote) / (s.vote_count - 1)), 1) WHERE s.id = '$id'"); // UPDATE vote_average & vote_count .serietv
    $results = $sql->query("SELECT s.vote_average, s.vote_count FROM serietv AS s WHERE s.id = '$id'"); // SELECT vote_serietv
    $data = $results->fetch_all(MYSQLI_ASSOC);

    echo json_encode(["results"=>$data]);
});