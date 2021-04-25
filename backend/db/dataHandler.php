<?php
include("./models/appointment.php");

class DataHandler
{
    public function queryAppointments()
    {
        $ret = array();
        $apps = $this->getDemoData();
        foreach ($apps as $app) {
            array_push($ret, $app->getArray());
        }
        return $ret;
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
