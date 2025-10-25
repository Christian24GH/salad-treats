<?php
try {
    $conn = new PDO(
        "mysql:host=localhost;dbname=u681654560_saladtreat",
        "u681654560_saladtreats",
        "U654394560_saladtreats"
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>