# Metrics Collection with Markus

Markus is a metrics library that we use in our project for collecting and reporting statistics about our code's operation. It provides a simple and consistent way to record custom metrics from your application, which can be crucial for monitoring and performance analysis.

Markus supports a variety of backends, including Datadog, Statsd, and Logging. This means you can choose the backend that best fits your monitoring infrastructure and requirements. Each backend has its own set of features and capabilities, but Markus provides a unified interface to all of them.

Once the metrics are collected by Markus they are then forwarded to Telegraf. Telegraf is an agent for collecting and reporting metrics, which we use to process and format the data before it's sent to Grafana.

Grafana is a popular open-source platform for visualizing metrics. It allows us to create dashboards with panels representing the metrics we're interested in, making it possible to understand the data at a glance.

Here's an example of how to use Markus to record a metric:

``` python
from bedrock.base import metrics

# Counting events
metrics.incr("event_name")

# Timing events
metrics.timing("event_name", 123)

# Or timing events with context manager
with metrics.timer("event_name"):
    ...  # code to time goes here
```

In addition to recording the metric values, Markus also allows you to add tags to your metrics. Tags are key-value pairs that provide additional context about the metric, making it easier to filter and aggregate the data in Grafana. For example, you might tag a metric with the version of your application, the user's country, or the result of an operation. To add tags to a metric in Markus, you can pass them as a dictionary to the metric recording method. Here's an example:

``` python
# Counting events with tags
metrics.incr("event_name", tags=[f"version:{version}", f"country:{country}"])
```

For more information, refer to the [Markus documentation](https://markus.readthedocs.io/).
