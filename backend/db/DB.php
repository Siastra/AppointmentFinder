<?php

include_once "./models/appointment.php";

class DB
{

    private string $charset = 'utf8mb4';
    private array $config;
    private PDO $conn;
    private array $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    public function __construct()
    {

        $this->config = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . "/config/config.json"),
            true);
        $username = $this->config["username"];
        $password = $this->config["password"];
        $db_name = $this->config["db_name"];
        $dsn = "mysql:host=localhost;dbname=$db_name;charset=$this->charset";
        try {

            $this->conn = new PDO($dsn, $username, $password, $this->options);
        } catch (Exception $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    public function insertAppointment(array $params): bool
    {
        $stmt = $this->conn->prepare("INSERT INTO `appointments` (`id`, `title`, `info`, `location`, `duration`) 
                                                 VALUES (NULL, ?, ?, ?, ?);");
        try {
            $stmt->execute([$params["title"], $params["info"], $params["location"], $params["duration"]]);
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function getAllAppointments() : array
    {
        $res = array();
        $stmt = $this->conn->prepare('SELECT id, title, location, info, duration FROM appointments;');
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            // output data of each row
            try {
                $apps = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($apps as $app) {
                    $appointment = new Appointment($app["title"], $app["location"], $app["info"],
                        $app["duration"], $this->getAllTimeslotsById($app["id"]));
                    array_push($res, $appointment->getArray());
                }
            } catch (Exception $e) {
                echo 'Exception abgefangen: ', $e->getMessage(), "\n";
            }
        }
        return $res;
    }

    public function getAllTimeslotsById(int $id) : array
    {
        $timeslots = array();
        $stmt = $this->conn->prepare('SELECT app_id, startTime FROM timeslots WHERE app_id = ?;');
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            // output data of each row
            try {
                $slots = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($slots as $slot) {
                    array_push($timeslots, $slot);
                }
            } catch (Exception $e) {
                echo 'Exception abgefangen: ', $e->getMessage(), "\n";
            }
        }
        return $timeslots;
    }

}