package com.example.txnora.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * for Idempotency purpose
 * we are storing processed events in the database
 * so we can check if they are processed once and all
 */
/*
IDEMPOTENCY :
a transaction initiates -> processing -> authorised -> settlement pending -> settled
after this Processed events will be saved in the database with some event id

again if Kafka tries to do the same transaction due to some confusion
then if id in processed events in the db
then it will not continue to do it again
and if not then it will continue to process
 */
@Document(collection = "processed_events")
public class ProcessedEvent {

    @Id
    private String eventId;

    private Instant processedAt;

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Instant getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(Instant processedAt) {
        this.processedAt = processedAt;
    }

    @Override
    public String toString() {
        return "ProcessedEvent{" +
                "eventId='" + eventId + '\'' +
                ", processedAt=" + processedAt ;


    }
}