# GH Sanity

Sane GitHub notifications.

![gh sanity logo](gh_sanity_logo.png)

## Setup

1. clone, pnpm install
2. add NEXT_GH_TOKEN in env
3. pnpm dev

![GH Sanity Screenshot](gh_sanity.png)

## Usage

It's pretty self-explanatory so I'll go into some of the reasons this keeps me sane. (Oh, settings in the upper right - couple things there I'll go into.)

- filter by PR or issue notifications. Seems like something gh would support, but they don't. (I just searched for the 100th time because it seems so basic...)
- filter by open or closed state - again... basic
- filter by draft
- Slim notification items - many more fit on the screen at a glance.
- Select all notifications in a repo at once. This enables a couple key workflows:
  - select all, deselect one or two, mark as read
  - select all while selecting notifications from other repos in one big swoop, mark as read
- In settings you can add prioritized repos (rearranging coming) which will always appear first.
- Also in settings, you can completely exclude notifications with certain labels.

For me, the combo of above things makes me somewhat sane. And we can continue to iterate on this as we see fit.
