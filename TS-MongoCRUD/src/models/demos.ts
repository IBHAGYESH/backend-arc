import db, { refType } from "../configs/db";

import { DEMOS } from "../helpers/db-table-names";
import { DEMO_ENUM } from "../helpers/enums";

interface IDemo {
  string: string;
  number?: number;
  date?: Date;
  boolean?: boolean;
  enum?: string;
  array?: [];
  arrayOfForeignKeys?: (typeof refType)[];
  foreignKey?: typeof refType;
}

interface IDemoDoc extends IDemo, db.Document {}

interface IModel extends db.Model<IDemoDoc> {
  build(attr: IDemo): IDemoDoc;
}

const schema = new db.Schema<IDemo>(
  {
    string: {
      type: String,
      trim: true,
      default: "string",
      required: true,
    },
    number: {
      type: Number,
    },
    date: {
      type: Date,
    },
    boolean: {
      type: Boolean,
    },
    enum: {
      type: String,
      enum: DEMO_ENUM,
    },
    array: {
      type: [],
    },
    arrayOfForeignKeys: {
      type: [refType],
    },
    foreignKey: {
      type: refType,
      ref: DEMOS,
    },
  },
  { timestamps: true }
);

schema.statics.build = (attr: IDemo) => {
  return new model(attr);
};

const model = db.model<IDemoDoc, IModel>(DEMOS, schema, DEMOS);
export default model;
