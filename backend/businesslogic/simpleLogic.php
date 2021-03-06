<?php
include("./db/dataHandler.php");

class SimpleLogic
{
    private DataHandler $dh;

    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param): ?array
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "queryVoteChoice":
                $res = $this->dh->queryVoteChoice($param);
                break;
            case "queryInsertAppointment":
                $res = $this->dh->queryInsertAppointment($param);
                break;
            case "getId":
                $res = $this->dh->get_AppId($param);
                break;
            case "getComment":
                $res = $this->dh->getComments($param);
                break;
            case "getTimeslots":
                $res = $this->dh->getTimeslots($param);
                break;
            case "getVotesById":
                $res = $this->dh->getVotesById($param);
                break;
            case "deleteAppoint":
                $res = $this->dh->deleteAppoint($param);
                break;

            default:
                $res = [];
                break;
        }
        return $res;
    }
}
