"use client"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"

interface Professor {
  id: number
  name: string
  avg_rating: number
  completion_rate: number
}

interface Classroom {
  id: number
  name: string
  avg_rating: number
  completion_rate: number
}

interface Analytics {
  institute: {
    id: string
    name: string
  }
  totals: {
    professors: number
    classrooms_active: number
    classrooms_archived: number
    students_total: number
    students_enrolled: number
  }
  feedback: {
    total_feedbacks: number
    completion_rate: number
  }
  ratings: {
    average_rating: number
  }
  sentiment: {
    positive_percentage: number
    neutral_percentage: number
    negative_percentage: number
  }
  highlights: {
    top_professors: Professor[]
    lowest_professors: Professor[]
    top_classrooms: Classroom[]
    lowest_classrooms: Classroom[]
  }
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #000000",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 3,
  },
  instituteName: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    borderBottom: "1 solid #cccccc",
    paddingBottom: 5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    width: "48%",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  statSubtext: {
    fontSize: 8,
    color: "#999999",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginRight: 10,
    color: "#000000",
  },
  ratingStars: {
    fontSize: 20,
    color: "#fbbf24",
  },
  sentimentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sentimentLabel: {
    fontSize: 11,
    color: "#333333",
  },
  sentimentValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  sentimentBar: {
    height: 6,
    backgroundColor: "#e5e5e5",
    borderRadius: 3,
    marginBottom: 12,
    overflow: "hidden",
  },
  sentimentFill: {
    height: "100%",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    marginBottom: 8,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 2,
  },
  listItemId: {
    fontSize: 9,
    color: "#666666",
  },
  listItemRight: {
    alignItems: "flex-end",
  },
  listItemRating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  listItemCompletion: {
    fontSize: 8,
    color: "#666666",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999999",
    borderTop: "1 solid #e5e5e5",
    paddingTop: 10,
  },
})

interface InstituteAnalyticsPDFProps {
  analytics: Analytics
}

export const InstituteAnalyticsPDF = ({ analytics }: InstituteAnalyticsPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Institute Analytics Report</Text>
        <Text style={styles.subtitle}>Performance and Feedback Analysis</Text>
        <Text style={styles.instituteName}>
          {analytics.institute.name === "All Institutes" ? "All Institutes" : analytics.institute.name}
        </Text>
        <Text style={styles.subtitle}>
          Generated on{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      {/* Overview Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Professors</Text>
            <Text style={styles.statValue}>{analytics.totals.professors}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active Classrooms</Text>
            <Text style={styles.statValue}>{analytics.totals.classrooms_active}</Text>
            <Text style={styles.statSubtext}>{analytics.totals.classrooms_archived} archived</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Students</Text>
            <Text style={styles.statValue}>{analytics.totals.students_total}</Text>
            <Text style={styles.statSubtext}>{analytics.totals.students_enrolled} enrolled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Feedbacks</Text>
            <Text style={styles.statValue}>{analytics.feedback.total_feedbacks}</Text>
            <Text style={styles.statSubtext}>{analytics.feedback.completion_rate}% completion rate</Text>
          </View>
        </View>
      </View>

      {/* Overall Rating */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Rating</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingValue}>{analytics.ratings.average_rating.toFixed(1)}</Text>
          <Text style={styles.ratingStars}>★★★★★</Text>
        </View>
      </View>

      {/* Sentiment Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sentiment Analysis</Text>

        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentLabel}>Positive</Text>
          <Text style={styles.sentimentValue}>{analytics.sentiment.positive_percentage}%</Text>
        </View>
        <View style={styles.sentimentBar}>
          <View
            style={[
              styles.sentimentFill,
              { width: `${analytics.sentiment.positive_percentage}%`, backgroundColor: "#16a34a" },
            ]}
          />
        </View>

        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentLabel}>Neutral</Text>
          <Text style={styles.sentimentValue}>{analytics.sentiment.neutral_percentage}%</Text>
        </View>
        <View style={styles.sentimentBar}>
          <View
            style={[
              styles.sentimentFill,
              { width: `${analytics.sentiment.neutral_percentage}%`, backgroundColor: "#ca8a04" },
            ]}
          />
        </View>

        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentLabel}>Negative</Text>
          <Text style={styles.sentimentValue}>{analytics.sentiment.negative_percentage}%</Text>
        </View>
        <View style={styles.sentimentBar}>
          <View
            style={[
              styles.sentimentFill,
              { width: `${analytics.sentiment.negative_percentage}%`, backgroundColor: "#dc2626" },
            ]}
          />
        </View>
      </View>

      {/* Top Performing Professors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Professors</Text>
        {analytics.highlights.top_professors.map((prof) => (
          <View key={prof.id} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemName}>{prof.name}</Text>
              <Text style={styles.listItemId}>ID: {prof.id}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemRating}>{prof.avg_rating.toFixed(1)}</Text>
              <Text style={styles.listItemCompletion}>{prof.completion_rate}% complete</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Performing Classrooms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Classrooms</Text>
        {analytics.highlights.top_classrooms.map((classroom) => (
          <View key={classroom.id} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemName}>{classroom.name}</Text>
              <Text style={styles.listItemId}>ID: {classroom.id}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemRating}>{classroom.avg_rating.toFixed(1)}</Text>
              <Text style={styles.listItemCompletion}>{classroom.completion_rate}% complete</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Institute Analytics Dashboard • Generated by Analytics System</Text>
    </Page>

    {/* Second Page for Needs Improvement */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Areas Requiring Attention</Text>
        <Text style={styles.instituteName}>
          {analytics.institute.name === "All Institutes" ? "All Institutes" : analytics.institute.name}
        </Text>
      </View>

      {/* Needs Improvement - Professors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professors Requiring Attention</Text>
        {analytics.highlights.lowest_professors.map((prof) => (
          <View key={prof.id} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemName}>{prof.name}</Text>
              <Text style={styles.listItemId}>ID: {prof.id}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemRating}>{prof.avg_rating.toFixed(1)}</Text>
              <Text style={styles.listItemCompletion}>{prof.completion_rate}% complete</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Needs Improvement - Classrooms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Classrooms Requiring Attention</Text>
        {analytics.highlights.lowest_classrooms.map((classroom) => (
          <View key={classroom.id} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemName}>{classroom.name}</Text>
              <Text style={styles.listItemId}>ID: {classroom.id}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemRating}>{classroom.avg_rating.toFixed(1)}</Text>
              <Text style={styles.listItemCompletion}>{classroom.completion_rate}% complete</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Institute Analytics Dashboard • Generated by Analytics System • Page 2</Text>
    </Page>
  </Document>
)

export const generatePDF = async (analytics: Analytics) => {
  const blob = await pdf(<InstituteAnalyticsPDF analytics={analytics} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  const fileName =
    analytics.institute.name === "All Institutes"
      ? "all-institutes-analytics-report.pdf"
      : `${analytics.institute.name.toLowerCase().replace(/\s+/g, "-")}-analytics-report.pdf`
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
