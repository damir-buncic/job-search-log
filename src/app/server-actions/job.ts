"use server";

import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import puppeteer, { ElementHandle } from "puppeteer";

export async function fetchJobs(status?: string, company?: string) {
  const where: Record<string, string | object> = {};
  if (status) where.status = status;
  if (company) where.company = { contains: company };

  return prisma.job.findMany({ where });
}

export async function fetchJobById(id: number) {
  try {
    return prisma.job.findUniqueOrThrow({
      where: {
        id: +id,
      },
      include: { comments: { orderBy: { createdAt: "desc" } } },
    });
  } catch {
    return null;
  }
}

export async function saveJob(id: number | undefined, job: Prisma.JobCreateInput) {
  if (!id) {
    const companyJob = await prisma.job.findFirst({ where: { company: job.company } });

    if (companyJob) {
      throw new Error("Job at the same company already exists");
    }
    await prisma.job.create({ data: job as Prisma.JobUncheckedCreateInput });
  } else {
    await prisma.job.update({ where: { id }, data: job });
  }
  revalidatePath("/");
  redirect("/");
}

type AutoFillData = { position: string; company: string; country: string; board: string };

export async function autoFill(link: string): Promise<AutoFillData> {
  const url = new URL(link);

  if (url.hostname.includes("linkedin")) {
    return getBoardData(link, ".top-card-layout__entity-info-container", getLinkedInData);
  } else if (url.hostname.includes("app.welcometothejungle")) {
    return getBoardData(link, '[data-testid="job-section"]', getWelcomeToTheJungleData);
  }
  throw new Error("Unsupported board");
}

async function getLinkedInData(container: ElementHandle<Element>) {
  const position = await getText(container, ".top-card-layout__title");
  const company = await getText(container, ".topcard__org-name-link");
  const country = await getText(container, ".topcard__flavor.topcard__flavor--bullet");

  return {
    position,
    company,
    country,
    board: "Linked In",
  };
}

async function getWelcomeToTheJungleData(container: ElementHandle<Element>) {
  const title = await getText(container, '[data-testid="job-title"]');
  const position = title.split(", ")[0];
  const company = title.split(", ")[1];
  const countryTag = await getText(container, '[data-testid="job-location-tag"]');
  const country = countryTag.replace("Remote in ", "");

  return {
    position,
    company,
    country,
    board: "Welcome to the Jungle",
  };
}

async function getBoardData(
  link: string,
  containerSelector: string,
  dataFn: (container: ElementHandle<Element>) => Promise<AutoFillData>
) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(link);

  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.waitForSelector(containerSelector, { timeout: 2500 });
  } catch {
    console.log("Not found, trying again");
    await page.goto(link);

    try {
      await page.waitForSelector(containerSelector, { timeout: 2500 });
    } catch {
      throw new Error("Could not fetch data");
    }
  }

  const container = await page.locator(containerSelector).waitHandle();
  if (container) {
    const data = await dataFn(container);
    await browser.close();
    return data;
  }
  await browser.close();
  throw new Error("Could not fetch data");
}

async function getText(container: ElementHandle<Element>, selector: string) {
  return (await container.evaluate((el, s) => (el.querySelector(s) as HTMLElement).innerText, selector)).trim();
}
