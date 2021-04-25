<?php

class Appointment {

    private string $title, $location, $info;
    private int $duration;
    private array $timeslots;

    public function __construct($title, $location, $info, $duration, $timeslots)
    {
        $this->title = $title;
        $this->location = $location;
        $this->info = $info;
        $this->duration = $duration;
        $this->timeslots = $timeslots;
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

    public function getArray() : array
    {
        return array($this->title, $this->info, $this->location, $this->duration, $this->timeslots);
    }
}
