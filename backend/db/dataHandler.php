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

    public function queryAppointments(): array
    {
        return $this->db->getAllAppointments();
    }

    public function get_AppId($param): array
    {
        return $this->db->get_AppId($param);
    }

    public function queryVoteChoice($param): array
    {
        return $this->db->queryVoteChoice($param);
    }

    public function queryInsertAppointment(array $params): array
    {
        $this->db->insertAppointment($params);
        return $this->queryAppointments();
    }

    public function getComments(array $params): array
    {
        return $this->db->getCommentsbyId($params);
    }

    public function getTimeslots(array $params): array
    {
        return $this->db->getTimeslots($params);
    }

    public function getVotesById(array $params): array
    {
        return $this->db->getVotesById($params);
    }

    public function deleteAppoint(array $params): array
    {
        $this->db->deleteAppoint($params);
        return $this->queryAppointments();

    }

}
