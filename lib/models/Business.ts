import mongoose, { Schema, model, models } from 'mongoose';

const BusinessSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
    },
    businessIndustry: {
      type: String,

    },
    businessAudience: {
      type: String,

    },
    businessDescription: {
      type: String,

    },
    businessBudget: {
      type: String,


    },
    businessGoal: {
      type: String,


    },
    aiResponse: {
      type: String,
    },
  },
  { timestamps: true }
);

const BusinessPlan = models.BusinessPlan || model('BusinessPlan', BusinessSchema);
export default BusinessPlan;
