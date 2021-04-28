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
        return $this->db->getAllAppointments();
    }
    public function get_AppId($param): array{
        return $this->db->get_AppId($param);
    }
    public function queryVoteChoice($param){
        $this->db->queryVoteChoice($param);
        return $this->queryAppointments();
    }
    public function queryInsertAppointment(array $params) : array
    {
        $this->db->insertAppointment($params);
        return $this->queryAppointments();
    }
    public function getComments(array $params):array{
        return $this->db->getCommentsbyId($params);
    }
    public function getTimeslots(array $params):array{
        return $this->db->getTimeslots($params);
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
