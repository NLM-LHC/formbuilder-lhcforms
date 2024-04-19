import {test, expect, Page} from '@playwright/test';

import {MainPO} from "./po/main-po";

test.describe('Window opener notice', async () => {

  test('should not exist', async ({page}) => {
    await page.goto('/');
    const mainPO = new MainPO(page);
    await mainPO.loadFLPage();
    // By now the notice should have been attached, if it is attached.
    await expect(page.getByText(MainPO.windowOpenerNotice)).not.toBeAttached();
  });
});

test.describe('Open form builder in a new window', async () => {
  let mainPO: MainPO;


  test.beforeEach(async ({page}) => {
    page.on('console', msg => {
      if(msg.type() === 'error') {
        console.error(msg.text());
      }
      else {
        console.log(msg.text());
      }
    });

    await page.goto('/tests/window-open-test.html');
    const pagePromise = page.context().waitForEvent('page');
    await page.getByRole('button', {name: 'Open form builder'}).click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState('domcontentloaded');
    mainPO = new MainPO(newPage);
    mainPO.clearSession();
    await mainPO.loadFLPage();
    await expect(mainPO.page.getByText(MainPO.windowOpenerNotice)).toBeVisible();
  });

  test('should open form builder in a new window', async ({page}) => {
    const initialQTitle = 'Form loaded from window-open-test.html';
    const messageData = {data: null};
    messageData.data = await getMessage(page, 'initialized');
    expect(messageData.data.type).toBe('initialized');
    messageData.data = await getMessage(page, 'updateQuestionnaire');
    expect(messageData.data.type).toBe('updateQuestionnaire');
    await page.getByRole('button', {name: 'Clear messages'}).click();
    await page.getByRole('button', {name: 'Post questionnaire'}).click();
    await expect(await mainPO.titleLocator).toHaveValue(initialQTitle);
    messageData.data = await getMessage(page, 'updateQuestionnaire');
    await expect(messageData.data.type).toBe('updateQuestionnaire');
    await expect(messageData.data.questionnaire.title).toBe(initialQTitle);

    await page.getByRole('button', {name: 'Clear messages'}).click();
    await mainPO.titleLocator.fill('');
    await mainPO.titleLocator.fill('xxxx');
    messageData.data = await getMessage(page, 'updateQuestionnaire');
    await expect(messageData.data.questionnaire.title).toBe('xxxx');

    await page.getByRole('button', {name: 'Clear messages'}).click();
    await mainPO.titleLocator.fill('');
    await mainPO.titleLocator.fill('yyyy');
    await mainPO.page.getByRole('button', {name: 'Close'}).click();
    messageData.data = await getMessage(page, 'closed');
    await expect(messageData.data.questionnaire.title).toBe('yyyy');
  });

  async function getMessage(page: Page, type: string) {
    let ret = null;
    const eventElementMap = {
      initialized: '#initW',
      updateQuestionnaire: '#updateQ',
      closed: '#closedQ'
    };

    const loc = eventElementMap[type];
    if(loc) {
      await expect(page.locator(loc)).toContainText(type); // Wait until the page is updated.
      const str = await page.locator(loc).textContent();
      ret = JSON.parse(str);
    }

    return ret;
  }
});

