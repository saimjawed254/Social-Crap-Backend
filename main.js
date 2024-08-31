// const { Builder, Browser, By, until, Key } = require("selenium-webdriver");
import { Builder, Browser, By, until, Key } from "selenium-webdriver";

// const chrome = require("selenium-webdriver/chrome");
// import chrome from "selenium-webdriver/chrome.js";

import { config } from "dotenv";
config({ path: "./config.env" });


// const chromeOptions = new chrome.Options();
// const service = new chrome.ServiceBuilder();

// chromeOptions.addArguments("--no-sandbox");
// chromeOptions.addArguments("--log-level=3");
// chromeOptions.setMobileEmulation({
//   userAgent:
//     "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/90.0.1025.166 Mobile Safari/535.19",
// });

async function login(bot, username, password) {
  await bot.get("https://www.instagram.com/accounts/login/");
  await bot.sleep(1000);
  try {
    const element = await bot.findElement(
      By.xpath("/html/body/div[4]/div/div/div[3]/div[2]/button")
    );
    await element.click();
  } catch (e) {
  }
  const usernameInput = await bot.wait(
    until.elementLocated(By.css('input[name="username"]')),
    10000
  );
  const passwordInput = await bot.wait(
    until.elementLocated(By.css('input[name="password"]')),
    10000
  );
  await usernameInput.clear();
  await usernameInput.sendKeys(username);
  await passwordInput.clear();
  await passwordInput.sendKeys(password);
  const loginButton = await bot.wait(
    until.elementLocated(By.css('button[type="submit"]')),
    2000
  );
  await loginButton.click();
  await bot.sleep(5000);
}

async function scrapeUserData(bot, username) {
  await bot.get("https://www.instagram.com/" + username + "/");
  await bot.sleep(1000);
  let pfp;
  let src;
  try {
    pfp = await bot.findElement(
      By.css(
        'img[class="xpdipgo x972fbf xcfux6l x1qhh985 xm0m39n xk390pu x5yr21d xdj266r x11i5rnm xat24cr x1mh8g0r xl1xv1r xexx8yu x4uap5 x18d9i69 xkhd6sd x11njtxf xh8yej3"]'
      )
    );

    src = await pfp.getAttribute("src");

    var totalFollowers = await bot
      .wait(
        until.elementLocated(By.xpath("//a[contains(@href, '/followers')]")),
        10000
      )
      .getText();
    var totalFollowing = await bot
      .wait(
        until.elementLocated(By.xpath("//a[contains(@href, '/following')]")),
        10000
      )
      .getText();
    var totalPosts = await bot
      .wait(
        until.elementLocated(By.xpath("//span[@class='x5n08af x1s688f']")),
        10000
      )
      .getText();
    var name = await bot
      .wait(
        until.elementLocated(
          By.xpath(
            "//span[@class='x1lliihq x1plvlek xryxfnj x1n2onr6 x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1i0vuye xvs91rp x1s688f x5n08af x10wh9bi x1wdrske x8viiok x18hxmgj']"
          )
        ),
        10000
      )
      .getText();
    try {
      var bio = await bot
        .wait(
          until.elementLocated(
            By.xpath("//span[@class='_ap3a _aaco _aacu _aacx _aad7 _aade']")
          ),
          10000
        )
        .getText();
    } catch (err) {
      bio = " ";
    }
  } catch (err) {
    return {
      message: "username invalid",
    };
  }

  const followersCount = totalFollowers.split(" ")[0];

  var arrOfFollowersCount = followersCount.split("");

  var numFollowers = 0;
  var str = "";
  arrOfFollowersCount.map((e) => {
    if (e === "M") {
      numFollowers = numFollowers * 1000000;
    } else if (e === "K") {
      numFollowers = numFollowers * 1000;
    } else if (e === ",") {
    } else {
      str = str + e;
      numFollowers = Number(str);
    }
  });


  const followingCount = totalFollowing.split(" ")[0];

  var arrOfFollowingCount = followingCount.split("");

  var numFollowing = 0;
  var str = "";
  arrOfFollowingCount.map((e) => {
    if (e === "M") {
      numFollowing = numFollowing * 1000000;
    } else if (e === "K") {
      numFollowing = numFollowing * 1000;
    } else if (e === ",") {
    } else {
      str = str + e;
      numFollowing = Number(str);
    }
  });


  const postsCount = totalPosts;

  var arrOfPostsCount = postsCount.split("");

  var numPosts = 0;
  var str = "";
  arrOfPostsCount.map((e) => {
    if (e === "M") {
      numPosts = numPosts * 1000000;
    } else if (e === "K") {
      numPosts = numPosts * 1000;
    } else if (e === ",") {
    } else {
      str = str + e;
      numPosts = Number(str);
    }
  });


  await bot.actions().sendKeys(Key.END).perform();
  await bot.sleep(1000);

  const userData = {
    src,
    name,
    bio,
    followers: numFollowers,
    following: numFollowing,
    posts: numPosts,
  };

  return userData;
}

async function scrapeFollowers(bot, username, userInput) {
  //------------------------To increase efficiency to 90%--------------------------//

  const numberF = Number(userInput * 0.85);

  //------------------------Opens the link and checks for followers link--------------------------//

  await bot.get("https://www.instagram.com/" + username + "/");
  await bot.sleep(2000);
  try {
    const followerLink = await bot.wait(
      until.elementLocated(By.xpath("//a[contains(@href, '/followers')]")),
      10000
    );
    await followerLink.click();
    await bot.sleep(2000);
  } catch (err) {
    return {
      message: "private account",
    };
  }
  //------------------------Gets the followers username--------------------------//

  const users = new Set();
  while (users.size <= numberF) {
    const followers = await bot.findElements(
      By.xpath("//a[contains(@href, '/')]")
    );
    for (const user of followers) {
      const href = await user.getAttribute("href");
      if (href) {
        users.add(href.split("/")[3]);
      }
    }
    await bot.actions().sendKeys(Key.END).perform();
    await bot.sleep(1000);
  }
  const usersArray = Array.from(users);
  const followersSet = new Set();
  const pattern = /xmt=/;
  usersArray.map((e) => {
    if (
      e !== "" &&
      e !== "blog" &&
      e !== "docs" &&
      e !== "about-us" &&
      e !== "legal" &&
      e !== "explore" &&
      e !== "accounts" &&
      e !== "reels" &&
      e !== "direct" &&
      e !== "soci_alcrap0" &&
      !pattern.test(e)
    ) {
      followersSet.add(e);
    }
  });

  return Array.from(followersSet);
}

async function scrapeFollowing(bot, username, userInput) {
  //------------------------To increase efficiency to 90%--------------------------//

  const numberF = Number(userInput * 0.9);

  //------------------------Opens the link and checks for followers link--------------------------//

  await bot.get("https://www.instagram.com/" + username + "/");
  await bot.sleep(2000);
  const followingLink = await bot.wait(
    until.elementLocated(By.xpath("//a[contains(@href, '/following')]")),
    10000
  );
  await followingLink.click();
  await bot.sleep(2000);

  //------------------------Gets the followers username--------------------------//

  const users = new Set();
  while (users.size <= numberF) {
    const following = await bot.findElements(
      By.xpath("//a[contains(@href, '/')]")
    );
    for (const user of following) {
      const href = await user.getAttribute("href");
      if (href) {
        users.add(href.split("/")[3]);
      }
    }
    await bot.actions().sendKeys(Key.END).perform();
    await bot.sleep(1000);
  }
  const usersArray = Array.from(users);
  const followingSet = new Set();
  const pattern = /xmt=/;
  usersArray.map((e) => {
    if (
      e !== "" &&
      e !== "blog" &&
      e !== "docs" &&
      e !== "about-us" &&
      e !== "legal" &&
      e !== "explore" &&
      e !== "accounts" &&
      e !== "reels" &&
      e !== "direct" &&
      e !== "soci_alcrap0" &&
      !pattern.test(e)
    ) {
      followingSet.add(e);
    }
  });

  return Array.from(followingSet);
}

async function allPosts(bot, username, userInput) {
  await bot.get("https://www.instagram.com/" + username + "/");
  const postsLinks = new Set();
  const likesCount = new Set('0');
  var likesCountArray
  try {
    await bot.wait(
      until.elementLocated(By.xpath("//a[contains(@href, '/p/')]")),
      10000
    );

    var i = 0;
    while (i <= userInput) {
      const postLink = await bot.findElements(
        By.xpath("//a[contains(@href, '/p/')]")
      );
      for (const link of postLink) {
        const href = await link.getAttribute("href");
        if (href) {
          postsLinks.add(href);
        }
      }
      try {
        const reelLink = await bot.findElements(
          By.xpath("//a[contains(@href, '/reel/')]")
        );
        for (const link of reelLink) {
          const href = await link.getAttribute("href");
          if (href) {
            postsLinks.add(href);
          }
        }
      } catch (err) {}
      await bot.actions().sendKeys(Key.END).perform();
      await bot.sleep(1000);
      i++;
    }
    const postsLinksArray = Array.from(postsLinks);
    for (const link of postsLinksArray) {
      await bot.get(link);
      const totalLikes = await bot
        .wait(
          until.elementLocated(By.xpath("//a[contains(@href,'/liked_by')]")),
          10000
        )
        .getText();
        if(totalLikes.includes("likes")){
          likesCount.add(totalLikes.split(" ")[0]);
        }
      // await bot.sleep(1000);
    }
    likesCountArray = Array.from(likesCount);
    return likesCountArray;
  } catch (error) {
    likesCountArray = Array.from(likesCount)
    return likesCountArray;
  }
}

async function scrape(auth, premium, username) {
  // const bot = await new Builder()
  //   .forBrowser(Browser.CHROME)
  //   .setChromeOptions(chromeOptions)
  //   .setChromeService(service)
  //   .build();

  const bot = await new Builder().forBrowser(Browser.CHROME).build()
  await bot.manage().setTimeouts({ pageLoad: 15000 });

  const user=process.env.USER;
  const password=process.env.PASSWORD;

  await login(bot, user, password);

  var userData, followersName, followingName, postLikes;

  if (premium == false) {
    userData = await scrapeUserData(bot, username);
    if (
      userData.message == "username invalid" ||
      userData.message == "unexpected error" ||
      userData.message == "private account"
    ) {
      return {
        message: "username invalid",
      };
    }
    if (userData.posts < 100) {
      postLikes = await allPosts(bot, username, userData.posts);
    } else {
      postLikes = await allPosts(bot, username, 99);
    }
  } else if (premium == true) {
    userData = await scrapeUserData(bot, username);
    if (userData.followers < 1000 && userData.following < 1000) {
      followersName = await scrapeFollowers(bot, username, userData.followers);
      if (followersName.message == "private account") {
        return {
          message: "private account",
        };
      }
      followingName = await scrapeFollowing(bot, username, userData.following);
    }
    if (userData.posts < 100) {
      postLikes = await allPosts(bot, username, userData.posts);
    } else {
      postLikes = await allPosts(bot, username, 99);
    }
  }
  await bot.quit();
  const allData = {
    userData,
    followersName,
    followingName,
    postLikes,
  };
  return allData;
}

export default scrape;
