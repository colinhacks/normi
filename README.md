<h1 align="center">Normi</h1>
<p align="center">if you're happy and you know it, leave a star</a></p>
<p align="center">created by <a href="https://twitter.com/vriad">@vriad</a></p>

## Motivation

One of the best things about MobX is that it lets you create and use observable objects _without_ worrying about normalization. If you get a big blob of nested JSON back from an API, you can wrap it up as an observable and pass it into your React components. Badda bing, badda boom.

So why build a normalized cache on top of MobX? Because it's literally magic.

If you normalize all data coming into your application, there is a _single copy_ of each "object" in your application. What do I mean by "object"? To understand that, let's look at an example.

<!-- normalization is free
just pass any blob of data into it and Normi deep-merges it into your existing store
there's only one copy of any object in memory at any time
tihs makes it impossible to have stale data -->

## Simple example

```ts
// First let's create a Normi instance
const normi = new Normi();

// Now let's pass some data into it!
normi.merge({ id: '123', name: 'Zendaya' });
// => { id: "123", name: "Zendaya" }
```

Makes sense! Normi is built with TypeScript so all type information is preserved. Now let's pass in a more detailed version of Zendaya.

```ts
normi.merge({
  id: '123',
  bestSong: 'Replay',
  bestMovie: 'Spiderman: Homecoming',
});
/* { 
  id: '123', 
  name: "Zendaya", 
  bestSong: "Replay", 
  bestMovie: "Spiderman: Homecoming" 
}
*/
```

As can see, Normi has merged the two objects, since their `id` properties were equivalent.

## Example

let's look at an example. you're building a blog. your homepage fetches a list of posts and renders them as a list of links.

```ts
const posts = await getPosts();
// { id: string; title: string; }[]
```

Once a user clicks on one of the links, you fetch a "detail view" of the post:

```ts
const post = await getPost(id);
// { id: string; title: string; content: string }
```

As you can see the "detail view" contains the `content` field in addition to the fields from before.

Without normalization, you'd now have two JavaScript objects in memory that correspond to the same blog post. It's now possible for your representation of those blog posts to get out of sync. If you updated the title of a post, you would have to re-fetch both `getPost()` and `getPosts()` to ensure that all the data in your application is up-to-date.

For complex applications, this quickly gets unsustainable. You need to know exactly which objects get fetched by which APIs and trigger a set of "refetches" every time you update something in your database. This problem is compounded by the single-page application paradigm and client-side routing - data fetched at the beginning of a long session will stick around for a long time, because there is no need for a full-page refresh.

Normi is designed to be the easiest possible way to get the benefits of denormalization with none of the usual hassles. There's no need to define

### unique identifiers

The hard part is knowing when two objects correspond to the same node. **By default**, Normi only has two criteria for a node:

1. Must be a plain JavaScript object (not an array or instance)
2. Must contain an `id` property

This works great if you're using UUIDs to uniquely identify every object in your database. If you're using auto-incrementing integers (`SERIAL` in Postgres) then this default configuration may not work. You'll run into problems where two objects from different tables have the same ID.

<!-- The second criterion can be configured however. -->

#### Custom ID key

If you use a different key to store object identifers, you can use that instead:

```ts
const normi = new Normi({ id: '__ID__' });

normi.merge({
  __ID__: '1234',
  size: 'Venti',
});
```

#### GraphQL

If you've used GraphQL or Apollo, you may be aware that Apollo's normalized cache generates a unique identifier by concatenating the `id` field and the `__typename` field. This works well for GraphQL APIs, where the `__typename` property is typically added into your data payloads automatically by your GraphQL server framework.

To configure similar behavior in Normi:

```ts
const normi = new Normi({ id: ['id', '__typename'] });
```

#### Fully custom identifiers

For any other use case, you're able to totally customize ID generation by passing a function into your params:

```ts
const normi = new Normi({
  id: data => {
    // generate a string from your object
    if (data.uid) return data.uid;
    if (data.id) return `__${data.id}`;
    return `${Math.random()}`;
  },
});
```
