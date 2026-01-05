# Experiments Checklist

See [A/B Testing](../../measurement/abtest.md) for full documentation.

## General

- [ ] There are [no conflicting experiments](../../measurement/abtest.md#avoiding-experiment-collisions)
- [ ] Consent is respected
- [ ] There is a [switch](../../development/feature-switches.md) to disable the experiment
    - [ ] With the experiment disabled, experiment variations do not load
    - [ ] With the experiment disabled, experiment code is not loaded
- [ ] If there are multiple conditions needed to run it, bundle the display logic into one variable
    - e.g. `is_enabled = switch('switchname') && geo=US && lang.startswith('en')`
- [ ] Test all variations
- [ ] Test an unexpected variation
- [ ] The events which will determine the success of the experiment are [being recorded](../../measurement/abtest.md#recording-the-data)
    - Usually in GA but sometimes Stub Attribution or FundraiseUp
    - [ ] If GA: an `experiment_view` event is reported in the DataLayer
- [ ] If a template was added, it is `noindex` and does not have the canonical or hreflang tags (bug 1442331)

## Traffic Cop Experiments

- [ ] Checks `isApprovedToRun` before activating
- [ ] Experiment activation logic is sound
- [ ] Traffic is split between variants as expected
- [ ] [Cookie support is not necessary or is included](../../measurement/abtest.md#cookies-consent)
