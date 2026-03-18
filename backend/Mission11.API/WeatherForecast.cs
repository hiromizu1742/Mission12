namespace Mission11.API;

// Simple DTO used by the template weather endpoint.
public class WeatherForecast
{
    public DateOnly Date { get; set; }

    public int TemperatureC { get; set; }

    // Convenience computed property (Celsius to Fahrenheit).
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

    public string? Summary { get; set; }
}
