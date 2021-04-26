<?php
include("./models/appointment.php");
include("./db/DB.php");

class DataHandler
{

    private DB $db;

    public function __construct()
    {
        $this->db = new DB();
    }

    public function queryAppointments() : array
    {
        $ret = array();
        $apps = $this->getDemoData();
        foreach ($apps as $app) {
            array_push($ret, $app->getArray());
        }
        return $ret;
    }

    public function queryInsertAppointment(array $params) : array
    {
        $this->db->insertApppointment($params);
        return $this->queryAppointments();
    }

    private static function getDemoData(): array
    {
        return [
            new Appointment("Yoga-Class", "Cleverfit", "Lorem fcffefcsf", 60,
                [date("Y-m-d h:i:sa", mktime(9, 0, 0, 4, 26, 2021))]),
            new Appointment("Strength-Class", "Cleverfit", "Lorem fcffefcsf", 120,
                [date("Y-m-d h:i:sa", mktime(9, 0, 0, 4, 27, 2021)),
                    date("Y-m-d h:i:sa", mktime(10, 0, 0, 4, 27, 2021))]),
            new Appointment("IT-Class", "FH Technikum", "Lorem fcffefcsf", 240,
                [date("Y-m-d h:i:sa", mktime(9, 0, 0, 4, 27, 2021)),
                    date("Y-m-d h:i:sa", mktime(10, 0, 0, 4, 27, 2021)),
                    date("Y-m-d h:i:sa", mktime(11, 0, 0, 4, 27, 2021)),
                    date("Y-m-d h:i:sa", mktime(10, 0, 0, 4, 28, 2021))])
        ];
    }

}
