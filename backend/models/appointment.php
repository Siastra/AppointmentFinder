<?php

class Appointment
{

    private string $title, $location, $info, $expiration_date;
    private int $duration;
    private array $timeslots;

    public function __construct($title, $location, $info, $duration, $expiration_date, $timeslots)
    {
        $this->title = $title;
        $this->location = $location;
        $this->info = $info;
        $this->duration = $duration;
        $this->timeslots = $timeslots;
        $this->expiration_date = $expiration_date;
    }

    /**
     * @return int
     */
    public function getDuration(): int
    {
        return $this->duration;
    }

    /**
     * @param int $duration
     */
    public function setDuration(int $duration): void
    {
        $this->duration = $duration;
    }

    /**
     * @return string
     */
    public function getInfo(): string
    {
        return $this->info;
    }

    /**
     * @param string $info
     */
    public function setInfo(string $info): void
    {
        $this->info = $info;
    }

    /**
     * @return string
     */
    public function getLocation(): string
    {
        return $this->location;
    }

    /**
     * @param string $location
     */
    public function setLocation(string $location): void
    {
        $this->location = $location;
    }

    /**
     * @return array
     */
    public function getTimeslots(): array
    {
        return $this->timeslots;
    }

    /**
     * @param array $timeslots
     */
    public function setTimeslots(array $timeslots): void
    {
        $this->timeslots = $timeslots;
    }

    /**
     * @param DateTime $timeslot
     */
    public function addTimeslot(DateTime $timeslot): void
    {
        array_push($this->timeslots, $timeslot);
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getExpirationDate(): string
    {
        return $this->expiration_date;
    }

    /**
     * @param string $expiration_date
     */
    public function setExpirationDate(string $expiration_date): void
    {
        $this->expiration_date = $expiration_date;
    }

    public function getArray(): array
    {
        return array($this->title, $this->info, $this->location, $this->duration, $this->expiration_date, $this->timeslots);
    }
}
