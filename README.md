<h1 align="center">Normi</h1>
<p align="center">if you're happy and you know it, leave a star</a></p>
<p align="center">created by <a href="https://twitter.com/vriad">@vriad</a></p>

## Motivation

One of the best things about MobX is that it lets you create and use observable objects _without_ worrying about normalization.

If you get a big blob of nested JSON back from an API, you can wrap it up as an observable and pass it into your React component tree. Badda bing, badda boom.

So why build a normalized cache on top of MobX?

Because there are zero downsides. Normi essentially gives you normalization for free. So as you fetch various JSON blo

normalization is free
just pass any blob of data into it and Normi deep-merges it into your existing store
there's only one copy of any object in memory at any time
tihs makes it impossible to have stale data

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

The hard part is knowing when two objects correspond to the same node. By default, Normi only has two criteria for a node:

1. Must be a plain JavaScript object (not an array or instance)
2. Must contain an `id` property

This works great if you're using UUIDs to uniquely identify every object in your database. If you're using auto-incrementing integers (`SERIAL` in Postgres) then this default configuration may not work. You'll run into problems where two objects from different tables have the same ID.

<!-- The second criterion can be configured however. -->

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
    return data.id;
  },
});
```
