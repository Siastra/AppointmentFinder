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

    public function queryInsertAppointment(array $params) : array
    {
        $this->db->insertAppointment($params);
        return $this->queryAppointments();
    }
}
