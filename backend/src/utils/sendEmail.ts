import { env } from "../lib/env";
import sgMail from "@sendgrid/mail";
import { Idea, User } from "@prisma/client";
import { logger } from "../lib/logger";

interface IEmail {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
sgMail.setApiKey(env.SENDGRID_API_KEY!);

const sendEmail = ({ to, from, subject, text, html }: IEmail) => {
  const msg = { to, from, subject, text, html };
  return sgMail.send(msg);
};

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, "nick" | "email">; addIdeaUrl?: string }) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Thanks For Registration, ${user.nick}!</h1>
          <p>Publish your first idea:</p>
          <a href="${env.WEBAPP_URL}/ideas/new" style="display:inline-block; padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:4px;">Add Idea</a>
        </body>
      </html>
    `;

    const text = `Thanks For Registration, ${user.nick}!\nPublish your first idea: ${env.WEBAPP_URL}/ideas/new`;

    return await sendEmail({
      to: user.email,
      from: env.FROM_EMAIL_ADDRESS,
      subject: "Thanks For Registration!",
      text,
      html,
    });
  } catch (error) {
    logger.error("Failed to send welcome email", error);
  }
};

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, "email">; idea: Pick<Idea, "name"> }) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Your Idea Blocked!</h1>
          <p>Sorry, but we blocked your idea: <strong>${idea.name}</strong></p>
        </body>
      </html>
    `;

    const text = `Your Idea Blocked!\nSorry, but we blocked your idea: ${idea.name}`;

    return await sendEmail({
      to: user.email,
      from: env.FROM_EMAIL_ADDRESS,
      subject: "Your Idea Blocked!",
      text,
      html,
    });
  } catch (error) {
    logger.error("Failed to send idea blocked email", error);
  }
};

export const sendIdeaLikedEmail = async ({
  user,
  idea,
  liker,
}: {
  user: Pick<User, "email">;
  idea: Pick<Idea, "name">;
  liker: { nick: string };
}) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Your Idea Liked</h1>
          <p>Congratulations! <strong>${liker.nick}</strong> liked your idea: <strong>${idea.name}</strong></p>
        </body>
      </html>
    `;

    const text = `Congratulations!\n${liker.nick} liked your idea: ${idea.name}`;

    return await sendEmail({
      to: user.email,
      from: env.FROM_EMAIL_ADDRESS,
      subject: "Your Idea liked!",
      text,
      html,
    });
  } catch (error) {
    logger.error("Failed to send idea liked email", error);
  }
};

export const sendMostLikedIdeasEmail = async ({
  user,
  ideas,
}: {
  user: Pick<User, "email">;
  ideas: Array<Pick<Idea, "nick" | "name">>;
}) => {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h1>Hello! Check this month’s most liked ideas:</h1>
          <ul>
            ${ideas.map((idea) => `<li><a href="${env.WEBAPP_URL}/ideas/${idea.nick}">${idea.name}</a></li>`).join("")}
          </ul>
        </body>
      </html>
    `;

    const text =
      "Hello! Check this month’s most liked ideas:\n" +
      ideas.map((idea) => `${idea.name}: ${env.WEBAPP_URL}/ideas/${idea.nick}`).join("\n");

    return await sendEmail({
      to: user.email,
      from: env.FROM_EMAIL_ADDRESS,
      subject: "Most Liked Ideas!",
      text,
      html,
    });
  } catch (error) {
    logger.error("Failed to send most liked ideas email", error);
  }
};
