import { kafkaClient, pusherClient } from "../config";

/**
 * Middleware to:
 * - Send events to custom kafka topic
 * - Send events to custom pusher channel
 * @param request
 * @param response
 * @param next
 */
const sendEvents = async (request: any, response: any, next: any) => {
  response.on("finish", async () => {
    // Create service result

    // Get events to send
    const eventsToSend: any[] = request.eventsToSend ?? [];

    // Set kafka producer
    const kafkaProducer = kafkaClient.producer();
    try {
      for (let i = 0; i < eventsToSend.length; i++) {
        const currentEvent = eventsToSend[i];

        // If kafka event produce data to topic
        if (currentEvent.kafka == true)
          await kafkaProducer.produce(currentEvent.topic, currentEvent.data);

        // If pusher event trigger event on channel with data
        if (currentEvent.pusher == true)
          await pusherClient.trigger(
            currentEvent.channel,
            currentEvent.event,
            currentEvent.data
          );
      }
    } catch (error) {
      console.error("src/middleware/send-event.ts", error);
    }
  });

  next();
};

export default sendEvents;
