<?php
include("./db/dataHandler.php");

class SimpleLogic
{
    private DataHandler $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    public function handleRequest($method, $param): array
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "queryInsertAppointment":
                $res = $this->dh->queryInsertAppointment($param);
                break;
            default:
                $res = [];
                break;
        }
        return $res;
    }
}
