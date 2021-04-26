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
        } catch (PDOException $e) {
            return false;
        }
        $id = $this->getLastAppointmentId();
        $stmt2 = $this->conn->prepare("INSERT INTO `timeslots` (`app_id`, `startTime`) 
                                                 VALUES (?, ?);");
        foreach ($params["timeslots"] as $timeslot) {
            try {
                $stmt2->execute([$id, $timeslot]);
            } catch (PDOException $e) {
                return false;
            }
        }
        return true;
    }

    public function getLastAppointmentId() : int
    {
        $stmt = $this->conn->prepare('SELECT max(id) as "lastId" FROM appointments;');
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            // output data of each row
            try {
                $app = $stmt->fetch(PDO::FETCH_ASSOC);
                return $app["lastId"];
            } catch (Exception $e) {
                echo 'Exception abgefangen: ', $e->getMessage(), "\n";
                return 0;
            }
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

    public function get_AppId(array $param): array
    {
        $stmt = $this->conn->prepare('SELECT id  FROM appointments WHERE title = ?' );
        $stmt->execute([$param["title"]]);
        $id = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $id[0];
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
                    array_push($timeslots, $slot["startTime"]);
                }
            } catch (Exception $e) {
                echo 'Exception abgefangen: ', $e->getMessage(), "\n";
            }
        }
        return $timeslots;
    }


    public function queryVoteChoice(array $params): bool
    {
        $stmt = $this->conn->prepare("INSERT INTO `choices` (`app_id`, `startTime`, `username`, `comment`) 
                                                 VALUES (?, ?, ?, ?);");
        try {
            $stmt->execute(["20", $params["time"], $params["username"], $params["comment"]]);
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
}