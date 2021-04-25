<?php
include("./db/dataHandler.php");

class SimpleLogic
{
    private DataHandler $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method): ?array
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
