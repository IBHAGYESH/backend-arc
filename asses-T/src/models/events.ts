import mongoose from "./db";

interface IDemo {
  event_name: string;
  event_title: string;
  event_description: string;
  event_location: string;
  event_date: Date;
  images: [
    {
      filename: string;
      path: string;
    }
  ];
}

const schema = new mongoose.Schema<IDemo>(
  {
    event_name: {
      type: String,
      required: true,
    },
    event_title: {
      type: String,
      required: true,
    },
    event_description: {
      type: String,
      required: true,
    },
    event_location: {
      type: String,
      required: true,
    },
    event_date: {
      type: Date,
      required: true,
    },
    images: [
      {
        filename: String,
        path: String,
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", schema, "Event");
export default Event;
