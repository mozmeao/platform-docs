# Code Reviews

Code reviews serve two purposes: they help maintain code quality and they're opportunities for knowledge sharing. A good review catches bugs and enforces standards, but it also helps people learn from each other.

This guide focuses on how to be an effective reviewer.

## Response Time Expectations

Review timing depends on the priority of work and the time zone of the reviewer:

| Type | Expected Response |
|------|-------------------|
| Security fixes / bug fixes on a deadline | Same day (please ping a reviewer on Slack) |
| Re-review on requested changes. | Same or next day. Please keep the review cycle short once it’s begun. |
| On roadmap / planned work | 1-2 business days. (Please share a link in your status update) |
| Contributor / unplanned work | When the team has capacity |
| Drafts | Will not be reviewed unless you specifically ask for feedback |

If you're assigned as a reviewer but can't review in time, communicate that so the author can find another reviewer.

## What to Review

Reviewers should be thinking about: functionality, accessibility, analytics, code quality, localization, maintainability (including tests), performance, and security.

We have some [code review checklists](checklists/index.md) to help avoid common problems.

## Giving Feedback

### Tone and Approach

- **Be constructive and kind.** Remember there's a person on the other end.
- **Focus on the code, not the person.** Say "This function could be simplified" rather than "You wrote this in a confusing way."
- **Acknowledge good solutions.** It's easy to only comment on problems. When you see something clever or well-done, say so.
- **Assume good intent.** If something looks wrong, ask about it before assuming it's a mistake.
- [**Aim to bring the code up a letter grade or two.**](https://mtlynch.io/human-code-reviews-2/#aim-to-bring-the-code-up-a-letter-grade-or-two) When there are many nitpicks or optional changes, limit what you're asking the author to change. 

### Feedback Format

Indicate clearly if feedback is blocking.

Some team members use [Conventional Comments](https://conventionalcomments.org/) but this is not required.

Examples of conventional comments:

- `praise: Clever use of grids!`
- `nitpick: Could use a more descriptive variable name here, but not a big deal.`
- `question: Should this page be excluded from search indexing?`
- `issue (blocking): This will break in production because X.`
- `chore (blocking): Please update this to use the existing helper in utils.py.`

### Style Disagreements

If there is a disagreement about code style or approach:

- Mozilla Staff front/back end leads get final say on critical decisions.
    - If a lead has to step in and make a decision, we should update the documentation to avoid the discussion in the future.
- Documentation, style guides, and config must be adhered to.
- PR author gets to make non-critical decisions.

## Approving and Merging

- **Approve and merge:** If all feedback is addressed or there is no feedback.
- **Approve but leave open:** If there are minor changes you trust the author to address.
- **Request changes:** Only for issues that must be fixed before merging.
- **Comment:** If your feedback is non blocking or you have not completed your code review.

If you approved with comments, consider adding a note like "Approved with minor suggestions - feel free to merge after addressing or ignore if you disagree."

You may also see these abbreviations on our repos: 

- **R+** = Approved.
- **R+wc** = Approved with requested changes.
- **R+ emoji** = Approved with a fun emoji. Don't think too hard about it, or have fun trying to figure out why this particular emoji was picked. For example: you might see R+🧼 (soap) for a PR which does code clean up, R+🫖 (tea pot) for a typo fix in en-GB or R+🧛(vampire) for a PR on VPN because it came up when the reviewer searched for emojis beginning with "V".

## Resources

- [How to Make Your Code Reviewer Fall in Love with You](https://mtlynch.io/code-review-love/)
- [How to Do Code Reviews Like a Human](https://mtlynch.io/human-code-reviews-1/)
- [How to Do Code Reviews Like a Human (Part Two)](https://mtlynch.io/human-code-reviews-2/)
- [Code Review Anxiety Workbook](https://developer-success-lab.gitbook.io/code-review-anxiety-workbook-1)
- [Conventional Comments](https://conventionalcomments.org/)
